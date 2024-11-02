import { PK, ReportResponse } from "@/types/api";
import { AxiosInstance, AxiosResponse, isAxiosError, Method } from "axios";
import { getSession } from "next-auth/react";
import { createApi } from "./api";
import { ApiException } from "./exceptions";
import { BaseURLs, InstanceServiceProps } from "./types";

export abstract class BaseService<T extends BaseURLs> {
  private _privateApi: AxiosInstance;
  private _publicApi: AxiosInstance;
  public urls: T;

  private static cachedSession = null; // Variable estática para cachear la sesión
  private static sessionExpiryTime = null; // Variable para almacenar la expiración de la sesión

  constructor(props: InstanceServiceProps = null) {
    this._privateApi = createApi();
    this._publicApi = createApi();

    this.urls = this.getUrls();

    this._privateApi.interceptors.request.use(
      async (config) => {
        if (BaseService.isServer()) {
          if (props?.token) {
            config.headers.Authorization = `Bearer ${props.token}`;
          }
        } else {
          // Comprobamos si la sesión está en cache y si aún es válida
          const currentTime = new Date().getTime();
          if (!BaseService.cachedSession || currentTime > BaseService.sessionExpiryTime) {
            const session = await getSession(); // Solo obtenemos la sesión si no está en cache o ha expirado
            if (session) {
              BaseService.cachedSession = session;
              // Asumimos que la sesión es válida por 1 hora (3600 * 1000 ms)
              BaseService.sessionExpiryTime = currentTime + 3600 * 1000; // Actualizar tiempo de expiración
            }
          }

          // Si tenemos un token de acceso en la sesión cacheada, lo usamos
          if (BaseService.cachedSession?.accessToken) {
            config.headers.Authorization = `Bearer ${BaseService.cachedSession.accessToken}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  abstract getUrls(): T;

  public static isServer(): boolean {
    return typeof window === "undefined";
  }

  public get privateApi(): AxiosInstance {
    return this._privateApi;
  }

  public get publicApi(): AxiosInstance {
    return this._publicApi;
  }

  public async request<R>(
    method: Method,
    url: string,
    data?: any,
    validateStatus: (status: number) => boolean = (status) => status >= 200 && status < 300,
    usePublicApi: boolean = false
  ): Promise<AxiosResponse<R>> {
    const apiInstance = usePublicApi ? this._publicApi : this._privateApi;
    try {
      const response = await apiInstance.request<R>({
        method,
        url,
        data,
        validateStatus,
      });
      if (validateStatus(response.status)) {
        return response;
      }
      throw new ApiException(`Error with status code ${response.status}`, response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async requestReport<B>(
    url: string,
    body: B | any = {},
    defaultFilename = null
  ): Promise<ReportResponse> {
    const response = await this.privateApi.post(url, body, {
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];

    let filename = defaultFilename;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }

    return {
      data: response.data,
      filename,
    };
  }

  async create<T>(data: T): Promise<AxiosResponse> {
    return this.request("post", this.urls.create, data, (status) => status === 201);
  }

  async update<T>(id: PK, data: T): Promise<AxiosResponse> {
    return this.request("put", this.urls.update(id), data, (status) => status === 200);
  }

  async delete(id: PK): Promise<void> {
    await this.request("delete", this.urls.delete(id));
  }

  async retrieve(id: PK): Promise<AxiosResponse> {
    return await this.request("get", this.urls.retrieve(id), undefined, (status) => status === 200);
  }

  protected handleError(error: any): never {
    if (isAxiosError(error) && error.response) {
      const { data } = error.response;
      console.log("RESPONSE ERROR: ", error.response);
      throw new ApiException("API Error", data);
    }
    throw new Error("Unexpected Error");
  }
}

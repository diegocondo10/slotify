import { NextPageContext } from 'next';
import { AppProps } from 'next/app';
import { BaseContext } from 'next/dist/shared/lib/utils';
import { ComponentType } from 'react';

// Definir NextComponentType para incluir help y isPrivate
export declare type NextComponentType<C extends BaseContext = NextPageContext, IP = {}, P = {}> = ComponentType<P> & {
  getInitialProps?(context: C): IP | Promise<IP>;
  help?: {
    title: string;
    content: string;
  };
  isPrivate?: boolean;
};

export type CustomNextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P>;

export type CustomAppProps<P = {}> = AppProps<P> & {
  Component: CustomNextPage<P>;
};

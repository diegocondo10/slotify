"use client";
import Button from "@/components/Buttons/Button";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import { PrimeIcons } from "primereact/api";
import { Menubar } from "primereact/menubar";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

const Navbar = () => {
  const session = useSession({ required: true });
  const op = useRef<OverlayPanel>(null);
  const end = () => (
    <>
      <Button
        label={session?.data?.user?.firstName}
        icon={PrimeIcons.USER}
        onClick={(e) => op.current?.toggle(e, null)}
      />
      <OverlayPanel ref={op} style={{ width: "300px" }}>
        <div className='grid'>
          <div className='col-12 text-center'>
            <i className={classNames(PrimeIcons.USER, "text-3xl w-full my-3")} />
            <h4 className='p-0 my-2'>{session.data.user.email}</h4>
          </div>
          <div className='col-12'>
            <Button
              className='btn-logout rounded-0'
              outlined
              sm
              label='Salir'
              icon={PrimeIcons.POWER_OFF}
              variant='danger'
              block
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                  redirect: true,
                })
              }
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );

  return (
    <header>
      <Menubar
        model={[
          {
            label: "Clientes",
          },
        ]}
        end={end}
      />
    </header>
  );
};

export default Navbar;
import { RegisterOptions } from 'react-hook-form';

export interface ControllerProps {
  name: string;
  rules?: RegisterOptions;
  shouldUnregister?: boolean;
  defaultValue?: any;
  control?: any;
}

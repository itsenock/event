declare module 'react-csv' {
  import { FC } from 'react';

  export interface CSVProps {
    data: object[] | string;
    headers?: { label: string; key: string }[];
    filename?: string;
    separator?: string;
    enclosingCharacter?: string;
    uFEFF?: boolean;
    target?: string;
    asyncOnClick?: boolean;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  }

  export const CSVLink: FC<CSVProps>;
  export const CSVDownload: FC<CSVProps>;
}

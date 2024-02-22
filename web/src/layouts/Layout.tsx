import { twMerge } from 'tailwind-merge';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  const mergedClassName = twMerge(
    'w-screen h-screen flex flex-col justify-center items-center bg-base-100',
    className
  );
  return <div className={mergedClassName}>{children}</div>;
}

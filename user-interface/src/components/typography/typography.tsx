import { HTMLAttributes } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

import { cn } from '@lib/utils';
import { forwardRefWithAs } from '@utils/render';

// ----------------------------------------------------------------------

const typographyVariants = tv({
  base: 'leading-snug',
  variants: {
    level: {
      h2: 'font-grotesk font-medium text-[3rem]/[3.5rem] -tracking-[0.02rem]',
      h3: 'font-grotesk font-medium text-[2.5rem]/[3rem] -tracking-[0.02rem]',
      h4: 'font-grotesk font-medium text-[2rem]/[2.5rem] -tracking-[0.02rem]',
      h5: 'font-grotesk font-medium text-[1.5rem]/[1.75rem] ',
      subheadline: 'font-rubik text-xl font-light',
      hairline1:
        'font-inter font-medium text-[0.75rem]/[1.25rem] tracking-[0.05rem]',
      body2b: 'font-inter font-bold text-[0.875rem]/[1.5rem]',
      body2m: 'font-inter font-medium text-[0.875rem]/[1.5rem]',
      body2r: 'font-inter font-normal text-[0.875rem]/[1.5rem]',
      body: 'font-inter font-normal text-[1rem]/[1.5rem]',
      smallsm: 'font-rubik font-semibold text-[0.625rem]/[0.75rem] ',
      small: 'font-rubik font-normal text-[0.625rem]/[0.75rem]',
      captionr: 'font-rubik font-normal text-[0.75rem]/[1rem]',
      captionsm: 'font-rubik font-semibold text-[0.75rem]/[1rem]',
      base2sm: 'font-rubik font-semibold text-[0.875rem]/[1.25rem]',
      base2r: 'font-rubik font-normal text-[0.875rem]/[1.25rem]',
      base2m: 'font-rubik font-medium text-[0.875rem]/[1.25rem]',
      basem: 'font-rubik font-medium text-[1rem]/[1.5rem]',
      baser: 'font-rubik font-normal text-[1rem]/[1.5rem]',
      title: 'font-rubik font-medium text-[1.25rem]/[1.5rem]',
    },
    color: {
      primary: 'text-neutral-black',
      secondary: 'text-neutral-white',
    },
  },
  defaultVariants: {
    level: 'body',
  },
});

const defaultVariantMapping: Record<
  NonNullable<VariantProps<typeof typographyVariants>['level']>,
  string
> = {
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  subheadline: 'span',
  hairline1: 'span',
  body2b: 'span',
  body2m: 'span',
  body2r: 'span',
  body: 'span',
  smallsm: 'span',
  small: 'span',
  captionr: 'span',
  captionsm: 'span',
  base2sm: 'span',
  base2r: 'span',
  base2m: 'span',
  basem: 'span',
  baser: 'span',
  title: 'h1',
};

export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof typographyVariants> {}

export const Typography = forwardRefWithAs<
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'b' | 'em' | 'div',
  TypographyProps
>((props, ref) => {
  const { level = 'body', color, children, as, className, ...rest } = props;

  const Tag = as ?? defaultVariantMapping[level ?? 'body'];

  return (
    <Tag
      ref={ref}
      className={cn(typographyVariants({ level, color }), className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});

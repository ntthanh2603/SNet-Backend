import {
  Ref,
  ReactNode,
  forwardRef,
  ElementType,
  ReactElement,
  ComponentPropsWithoutRef,
} from 'react';

/*
    forwardRefWithAs lets us forward refs while keeping the correct component type,
    which can be specified by the `as` prop.
  */

/* eslint-disable */
//prettier-ignore

export type ElementTagNameMap = HTMLElementTagNameMap &
    Pick<SVGElementTagNameMap, Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>>

export type AsProp<Comp extends ElementType, Props> = {
  as?: Comp;
  ref?: Ref<
    Comp extends keyof ElementTagNameMap
      ? ElementTagNameMap[Comp]
      : Comp extends new (...args: any) => any
        ? InstanceType<Comp>
        : undefined
  >;
} & Omit<ComponentPropsWithoutRef<Comp>, 'as' | keyof Props>;

export type CompWithAsProp<Props, DefaultElementType extends ElementType> = <
  Comp extends ElementType = DefaultElementType,
>(
  props: AsProp<Comp, Props> & Props,
) => ReactElement;

export const forwardRefWithAs = <
  DefaultElementType extends ElementType,
  BaseProps,
>(
  render: (
    props: BaseProps & { as?: ElementType },
    ref: React.Ref<any>,
  ) => Exclude<ReactNode, undefined>,
): CompWithAsProp<BaseProps, DefaultElementType> => {
  return forwardRef(render as any) as any;
};

type GetEventHandlers<T extends keyof JSX.IntrinsicElements> = Extract<
  keyof JSX.IntrinsicElements[T],
  `on${string}`
>;

/**
 * Provides the event type for a given element and handler.
 *
 * @example
 *
 * type MyEvent = EventFor<"input", "onChange">;
 */
export type EventFor<
  TElement extends keyof JSX.IntrinsicElements,
  THandler extends GetEventHandlers<TElement>,
> = JSX.IntrinsicElements[TElement][THandler] extends
  | ((e: infer TEvent) => any)
  | undefined
  ? TEvent
  : never;

import React, {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "./utils";

export const UnitIcon = ({
  src,
  withInsetBorder = false,
  borderClassName = "",
  ...props
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
  withInsetBorder?: boolean;
  borderClassName?: string;
}) => {
  const [hasRendered, setHasRendered] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (ref.current && hasRendered) {
      ref.current!.src = src || "";
    }
  }, [src, hasRendered]);

  useEffect(() => {
    setHasRendered(true);
    if (ref.current) {
      ref.current.onerror = onError1;
    }
  }, []);

  const onError1 = (event: Event | string) => {
    if (typeof event === "string") {
      return;
    }
    // console.log("onError1", event);
    const target = event.currentTarget as HTMLImageElement;
    target.onerror = onError2;

    const currentUrlObj = new URL(target.src);
    // withour params
    const currentUrl = currentUrlObj.origin + currentUrlObj.pathname;

    const newUrlObj = new URL(currentUrl);
    const newUrl = newUrlObj.origin + "/original" + newUrlObj.pathname;
    target.srcset = target.srcset.replaceAll(currentUrl, newUrl);
    target.src = target.src.replace(currentUrl, newUrl);
  };

  /**
   * originalも見つからなかった時のフォールバック
   */
  const onError2 = (event: Event | string) => {
    if (typeof event === "string") {
      return;
    }
    // console.log("onError2", event);
    const target = event.currentTarget as HTMLImageElement;
    target.onerror = null;

    const currentUrlObj = new URL(target.src);
    // withour params
    const currentUrl = currentUrlObj.origin + currentUrlObj.pathname;

    const placeholder =
      import.meta.env.VITE_CDN_BASE_URL +
      `/formationicon/FormationIcon_empty.webp`;

    target.srcset = target.srcset.replaceAll(currentUrl, placeholder);
    target.src = target.src.replace(currentUrl, placeholder);
  };

  if (withInsetBorder) {
    return (
      <div className={cn("relative overflow-hidden", props.className)}>
        <img
          {...props}
          src={src}
          ref={ref}
          className={cn(
            "pointer-events-auto relative aspect-square h-full w-full"
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-gray-600 ring-opacity-30",
            borderClassName
          )}
        ></div>
      </div>
    );
  }

  return <img {...props} src={src} ref={ref} />;
};

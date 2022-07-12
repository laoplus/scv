import clsx, { ClassValue } from "clsx";
import { overrideTailwindClasses } from "tailwind-override";

export const cn = (...classNames: ClassValue[]) => {
    return overrideTailwindClasses(clsx(...classNames));
};

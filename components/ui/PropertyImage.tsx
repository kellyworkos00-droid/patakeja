import { Image, ImageSourcePropType } from "react-native";

type PropertyImageProps = {
  source: ImageSourcePropType;
  className?: string;
};

export function PropertyImage({ source, className = "h-52 w-full rounded-3xl" }: PropertyImageProps) {
  return <Image source={source} className={className} resizeMode="cover" />;
}

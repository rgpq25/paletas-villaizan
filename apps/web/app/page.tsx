import { Button } from '@/components/button';
import Image, { type ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src'> & {
    srcLight: string;
    srcDark: string;
};

const ThemeImage = (props: Props) => {
    const { srcLight, srcDark, ...rest } = props;

    return (
        <>
            <Image {...rest} src={srcLight} className="imgLight" />
            <Image {...rest} src={srcDark} className="imgDark" />
        </>
    );
};

export default function Home() {
    return (
        <div className={'flex h-dvh w-dvw'}>
            <Button className="m-auto">Hola!</Button>
        </div>
    );
}

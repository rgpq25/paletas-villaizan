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
        <div className={'text-red-500 flex h-dvh w-dvw'}>
            {/* <Button>hola</Button> */}
            <p className='m-auto text-xl font-bold'>hola!</p>
        </div>
    );
}

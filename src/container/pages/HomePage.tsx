import { Grid2, H2, Image, Layout } from '@/components';
import { Header } from '@/container/components';
import { useScroll } from '@/hooks/useScroll';
import tw from 'tailwind-styled-components';
export function HomePage(): React.JSX.Element {
  const { scrollY } = useScroll();

  const medias = [
    { id: 1, url: '/images/header.jpg' },
    {
      id: 2,
      url: 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg',
    },
  ];

  return (
    <Layout isNavClose={scrollY < 100}>
      <Header />
      <Main>
        <Title>{'Exemple Media Swiper'}</Title>
        <ImagesContainer>
          {medias.map((media) => (
            <ImageStyled key={media.id} src={media.url} alt='media' />
          ))}
        </ImagesContainer>
      </Main>
    </Layout>
  );
}

const Main = tw.div`
  flex
  flex-col
  items-center
  justify-center
  w-full md:w-2/3
`;

const Title = tw(H2)`
  text-center
  mt-5 md:mt-10
`;

const ImagesContainer = tw(Grid2)`
  my-5
  w-full
`;

const ImageStyled = tw(Image)`
  cursor-pointer
  w-full
`;

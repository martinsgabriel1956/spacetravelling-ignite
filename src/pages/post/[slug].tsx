import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';

import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const { isFallback } = useRouter();

  const estimatedTime = post.data.content.reduce((total, content) => {
    total += content.heading.split(' ').length;

    const words = content.body.map(item => item.text.split(' ').length);
    words.map(word => (total += word));

    return total;
  }, 0);

  const readTime = Math.ceil(estimatedTime / 200);

  return (
    <>
      {isFallback ? (
        <h1>Carregando...</h1>
      ) : (
        <>
          <Head>
            <title>{post.data.title} | spacetravelling.</title>
          </Head>
          <div className={styles.bannerContainer}>
            <img src={post.data.banner.url} alt="" />
          </div>
          <div className={commonStyles.container}>
            <h1 className={styles.title}>{post.data.title}</h1>
            <div className={commonStyles.postInfo}>
              <span>
                <FiCalendar
                  size={22}
                  color="#BBBBBB"
                  style={{
                    marginRight: '10px',
                  }}
                />
                {format(new Date(post.first_publication_date), `dd MMM yyyy`, {
                  locale: ptBR,
                })}
              </span>
              <span>
                <FiUser
                  size={22}
                  color="#BBBBBB"
                  style={{
                    marginRight: '10px',
                  }}
                />
                {post.data.author}
              </span>
              <span>
                <FiClock
                  size={22}
                  color="#BBBBBB"
                  style={{
                    marginRight: '10px',
                  }}
                />
                {`${readTime} min`}
              </span>
            </div>
            <article className={styles.content}>
              {post.data.content.map(({ body, heading }) => (
                <div key={heading}>
                  <h2>{heading}</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(body),
                    }}
                  />
                </div>
              ))}
            </article>
          </div>
        </>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { params } = context;
  const slug = params.slug as string;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', slug, {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body,
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
  };
};

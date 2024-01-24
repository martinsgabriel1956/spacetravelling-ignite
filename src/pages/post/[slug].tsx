import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import Link from 'next/link';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Comments from '../../components/Comments';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
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
  navigation: {
    previousPost: {
      uid: string;
      data: {
        title: string;
      };
    }[];
    nextPost: {
      uid: string;
      data: {
        title: string;
      };
    }[];
  };
  preview: boolean;
}

export default function Post({ post, preview, navigation }: PostProps) {
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
          <section className={commonStyles.container}>
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
            <p className={styles.lastPublication}>
              {format(
                new Date(post.last_publication_date),
                "'* editado em' dd MMM yyyy', às' H':'m",
                {
                  locale: ptBR,
                }
              )}
            </p>
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
            <section className={`${styles.navigation}`}>
              <div className={styles.btnContainer}>
                {navigation?.previousPost.length > 0 && (
                  <div className={styles.previousPost}>
                    <h3>{navigation.previousPost[0].data.title}</h3>
                    <Link href={`/post/${navigation.previousPost[0].uid}`}>
                      <a>Post anterior</a>
                    </Link>
                  </div>
                )}

                {navigation?.nextPost.length > 0 && (
                  <div className={styles.nextPost}>
                    <h3>{navigation.nextPost[0].data.title}</h3>
                    <Link href={`/post/${navigation.nextPost[0].uid}`}>
                      <a>Próximo post</a>
                    </Link>
                  </div>
                )}
              </div>
            </section>
            <Comments />
            <div className={commonStyles.modePreviewContainer}>
              {preview && (
                <aside className={commonStyles.buttonModePreview}>
                  <Link href="/api/exit-preview">
                    <a>Sair do modo Preview</a>
                  </Link>
                </aside>
              )}
            </div>
          </section>
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

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const previousPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date ]',
    }
  );
  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.last_publication_date desc]',
    }
  );

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
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
      navigation: {
        previousPost: previousPost?.results,
        nextPost: nextPost?.results,
      },
      preview,
    },
  };
};

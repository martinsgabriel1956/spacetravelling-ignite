import { useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPost, setNextPost] = useState(postsPagination.next_page);

  async function loadMorePosts(nextPage: string): Promise<void> {
    const response = await fetch(nextPage);
    const { next_page, results } = await response.json();

    const newPostPagination = {
      nextPage: next_page,
      results: results.map(({ uid, first_publication_date, data }: Post) => {
        return {
          uid,
          first_publication_date,
          data,
        };
      }),
    };
    setNextPost(newPostPagination.nextPage);
    setPosts(prevState => [...prevState, ...newPostPagination.results]);
  }

  return (
    <>
      <Head>
        <title>Home | spacetravelling.</title>
      </Head>
      <main className={commonStyles.container}>
        <ul>
          {posts.map(post => (
            <li className={styles.postContainer} key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <div className={commonStyles.postInfo}>
                    <span>
                      <FiCalendar
                        size={22}
                        color="#BBBBBB"
                        style={{
                          marginRight: '10px',
                        }}
                      />
                      {format(
                        new Date(post.first_publication_date),
                        `dd MMM yyyy`,
                        {
                          locale: ptBR,
                        }
                      )}
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
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        {nextPost !== null && (
          <button
            className={styles.loadMorePostsButton}
            type="button"
            onClick={() => loadMorePosts(nextPost)}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 3,
    }
  );

  const posts = postsResponse.results.map((post: Post) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const { next_page } = postsResponse;

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page,
      },
    },
    revalidate: 60 * 30,
  };
};

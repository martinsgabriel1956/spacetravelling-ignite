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
  const [posts, setPosts] = useState(postsPagination.results);

  return (
    <>
      <Head>
        <title>Home | spacetravelling.</title>
      </Head>
      <main className={styles.contentContainer}>
        <ul>
          {posts.map(post => (
            <li className={styles.postContainer} key={post.uid}>
              <Link href="/">
                <a>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.postInfo}>
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
        {postsPagination.next_page !== null && (
          <button type="button">Carregando mais posts</button>
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
      pageSize: 10,
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

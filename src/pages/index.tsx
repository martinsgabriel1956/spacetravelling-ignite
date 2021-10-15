import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

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

export default function Home({}) {
  return (
    <>
      <Head>
        <title>Home | spacetravelling.</title>
      </Head>
      <main className={styles.contentContainer}>
        <ul>
          <li className={styles.postContainer}>
            <Link href="/">
              <a>
                <h1>Como utilizar Hooks</h1>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div className={styles.postInfo}>
                  <span>
                    <FiCalendar
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    15 Mar 2021
                  </span>
                  <span>
                    <FiUser
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    Joseph Oliveira
                  </span>
                </div>
              </a>
            </Link>
          </li>
          <li className={styles.postContainer}>
            <Link href="/">
              <a>
                <h1>Como utilizar Hooks</h1>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div className={styles.postInfo}>
                  <span>
                    <AiOutlineCalendar
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    15 Mar 2021
                  </span>
                  <span>
                    <FiUser
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    Joseph Oliveira
                  </span>
                </div>
              </a>
            </Link>
          </li>
          <li className={styles.postContainer}>
            <Link href="/">
              <a>
                <h1>Como utilizar Hooks</h1>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div className={styles.postInfo}>
                  <span>
                    <AiOutlineCalendar
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    15 Mar 2021
                  </span>
                  <span>
                    <FiUser
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    Joseph Oliveira
                  </span>
                </div>
              </a>
            </Link>
          </li>
          <li className={styles.postContainer}>
            <Link href="/">
              <a>
                <h1>Como utilizar Hooks</h1>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div className={styles.postInfo}>
                  <span>
                    <AiOutlineCalendar
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    15 Mar 2021
                  </span>
                  <span>
                    <FiUser
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    Joseph Oliveira
                  </span>
                </div>
              </a>
            </Link>
          </li>
          <li className={styles.postContainer}>
            <Link href="/">
              <a>
                <h1>Como utilizar Hooks</h1>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div className={styles.postInfo}>
                  <span>
                    <AiOutlineCalendar
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    15 Mar 2021
                  </span>
                  <span>
                    <FiUser
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    Joseph Oliveira
                  </span>
                </div>
              </a>
            </Link>
          </li>
          <li className={styles.postContainer}>
            <Link href="/">
              <a>
                <h1>Como utilizar Hooks</h1>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div className={styles.postInfo}>
                  <span>
                    <AiOutlineCalendar
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    15 Mar 2021
                  </span>
                  <span>
                    <FiUser
                      size={22}
                      color="#BBBBBB"
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    Joseph Oliveira
                  </span>
                </div>
              </a>
            </Link>
          </li>
        </ul>
        <button type="button">Carregando mais posts</button>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };

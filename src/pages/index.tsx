import Head from "next/head"
import { useRouter } from "next/router"
import env from "@/env"
import { wpGetAllPosts } from "../lib/wp-posts"
import { PostCard } from "@/components/Card/PostCard"
import { PostCardSide } from "@/components/Card/PostCardSide"
import { Header } from "@/components/Header"

export default function Home(props) {
  const { posts } = props
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{env.SITE_TITLE}</title>
        <meta name="description" content={env.ABOUT} />
        <meta property="og:title" content={env.SITE_TITLE} />
        <meta property="og:title" content={env.SITE_TITLE} />
        <meta property="og:description" content={env.ABOUT} />
        <link
          rel="canonical"
          href={`https://${env.DOMAIN}${router.pathname}`}
        />
      </Head>
      <Header>
        <section className="mx-8 flex flex-row">
          <div>
            {posts.map((e) => {
              return (
                <PostCard
                  key={e.id}
                  image={e.featuredImage}
                  slug={e.slug}
                  title={e.title}
                  excerpt={e.excerpt}
                />
              )
            })}
          </div>

          <aside className="w-4/12">
            <div className="rounded-xl border border-gray-100 p-4 sticky top-8">
              {posts.map((e) => {
                return (
                  <PostCardSide
                    key={e.id}
                    image={e.featuredImage}
                    slug={e.slug}
                    title={e.title}
                  />
                )
              })}
            </div>
          </aside>
        </section>
      </Header>
    </>
  )
}

export async function getServerSideProps() {
  const { posts } = await wpGetAllPosts()
  return { props: { posts } }
}

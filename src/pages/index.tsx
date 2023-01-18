import * as React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Heading } from "@/ui"
import parse from "html-react-parser"
import env from "@/env"
import { wpGetAllPosts } from "../lib/wp-posts"
import { PostCard } from "@/components/Card/PostCard"
import { PostCardSide } from "@/components/Card/PostCardSide"
import { HomeLayout } from "@/layouts/HomeLayout"
import { getSeoDatas } from "@/lib/wp-seo"

interface HomeProps {
  posts: any
}

export default function Home(props: HomeProps) {
  const { posts, seo } = props
  // // const postsListA = posts.slice(0, posts.length / 2)
  // // const postsListB = posts.slice(posts.length / 2)
  // const [postsLM, setPostsLM] = React.useState(posts)
  const router = useRouter()
  // const [endCursor, setEndCursor] = React.useState(pageInfo.endCursor)
  // const infiniteScroll = async () => {
  //   const { posts, pageInfo } = await wpGetAllPostsLoadMore(endCursor)
  //   setPostsLM([...posts, ...postsLM])
  //   setEndCursor(pageInfo.endCursor)
  // }
  // console.log(postsLM)

  // const handleKeyDown = async () => {
  //   const { scrollHeight, scrollTop, clientHeight } = document.documentElement
  //   if (scrollTop + clientHeight > scrollHeight) {
  //     await infiniteScroll()
  //   }
  // }
  // console.log(postsLM)
  // React.useEffect(() => {
  //   window.addEventListener("scroll", handleKeyDown)

  //   // cleanup this component
  //   return () => {
  //     window.removeEventListener("scroll", handleKeyDown)
  //   }
  // }, [])
  return (
    <>
      <Head>{seo.success === true && parse(seo.head)}</Head>
      <HomeLayout>
        <section className="mx-4 container 2xl:!max-w-[1536px] md:mx-auto w-full flex flex-row lg:mx-auto lg:px-4">
          <div className="w-full flex flex-col lg:mr-4">
            {posts.map(
              (post: {
                id: number
                featuredImage: {
                  sourceUrl: string
                  altText: string
                }
                title: string
                slug: string
                excerpt: string
                categories: any
                author: {
                  name: string
                  avatar: {
                    url: string
                  }
                  uri: string
                }
                uri: string
                date: string
              }) => {
                return (
                  <PostCard
                    key={post.id}
                    src={post.featuredImage.sourceUrl}
                    alt={post.featuredImage.altText}
                    slug={post.uri}
                    title={post.title}
                    excerpt={post.excerpt}
                    authorName={post.author.name}
                    authorAvatarUrl={post.author.avatar.url}
                    authorUri={post.author.uri}
                    date={post.date}
                  />
                )
              },
            )}
          </div>

          <aside className="w-4/12 hidden lg:block">
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 sticky top-8">
              <div className="mb-4">
                <Heading as="h4" className="!text-transparent">
                  <span className="after:absolute after:border after:border-[#1e3799] after:bg-[#1e3799] after:h-[3px] after:w-[50px] after:ml-[-25px] after:left-1/2 after:top-[40px]">
                    Trending
                  </span>
                </Heading>
              </div>
              {posts.map(
                (post: {
                  id: number
                  featuredImage: {
                    sourceUrl: string
                    altText: string
                  }
                  title: string
                  slug: string
                  excerpt: string
                  categories: any
                  uri: string
                }) => {
                  return (
                    <PostCardSide
                      key={post.id}
                      src={post.featuredImage.sourceUrl}
                      alt={post.featuredImage.altText}
                      slug={post.uri}
                      title={post.title}
                    />
                  )
                },
              )}
            </div>
          </aside>
        </section>
      </HomeLayout>
    </>
  )
}

export async function getServerSideProps() {
  const { posts, pageInfo } = await wpGetAllPosts()
  const seo = await getSeoDatas(`https://${env.DOMAIN}`)

  return { props: { posts, pageInfo, seo } }
}

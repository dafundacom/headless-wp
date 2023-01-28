import * as React from "react"
import Head from "next/head"
import parse from "html-react-parser"
import NextLink from "next/link"
import { GetServerSideProps } from "next"
import dynamic from "next/dynamic"
import env from "@/env"
import { wpGetTagBySlug } from "@/lib/wp-tags"
import { wpGetPostsByTagId } from "@/lib/wp-posts"
import { getSeoDatas } from "@/lib/wp-seo"
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

const HomeLayout = dynamic(() =>
  import("@/layouts/HomeLayout").then((mod) => mod.HomeLayout),
)
const InfiniteScroll = dynamic(() =>
  import("@/components/InfiniteScroll").then((mod) => mod.InfiniteScroll),
)
const Button = dynamic(() => import("@/ui").then((mod) => mod.Button))
const Heading = dynamic(() => import("@/ui").then((mod) => mod.Heading))
interface TagProps {
  tag: {
    name: string
    slug: string
    id: string
  }
  seo: {
    head: string
    success: boolean
  }
  posts: any
  pageInfo: any
}

export default function Tag(props: TagProps) {
  const { tag, posts, seo, pageInfo } = props

  return (
    <>
      <Head>{seo.success === true && parse(seo.head)}</Head>
      <HomeLayout>
        <section className="flex w-full flex-col">
          <div className="flex py-10 mb-10 flex-col bg-gradient-to-r from-[#1e3799] to-[#0984e3] relative">
            <div className="absolute top-1">
              <nav className="ml-2 flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center text-white">
                  <li className="inline-flex items-center">
                    <NextLink
                      href="/"
                      className="inline-flex items-center text-sm font-medium text-white dark:text-gray-400 dark:hover:text-white after:inline-block after:not-italic after:font-normal after:ml-2 after:mr-2 after:align-top after:content-['>']"
                    >
                      Home
                    </NextLink>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white dark:text-gray-400">
                        {tag.name}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="self-center">
              <Heading size="4xl" className="text-white">
                Gamedaim
              </Heading>
            </div>
            <div className="self-center">
              <NextLink href={`/${tag.slug}`}>
                <Button className="!mr-2 border border-[#24272f] !bg-[#1e3799]">
                  All
                </Button>
              </NextLink>
            </div>
          </div>
          <div className="mx-auto px-4 w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px] md:mx-auto flex flex-row">
            <div className="w-full flex flex-col lg:mr-4">
              <InfiniteScroll
                pageType="tag"
                posts={posts}
                id={tag.id}
                pageInfo={pageInfo}
              />
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
                    slug: string
                    title: string
                    excerpt: string
                    categories: any
                    uri: string
                  }) => {
                    return (
                      <PostCardSide
                        key={post.id}
                        src={post.featuredImage.sourceUrl}
                        alt={post.featuredImage.altText}
                        title={post.title}
                        slug={post.uri}
                      />
                    )
                  },
                )}
              </div>
            </aside>
          </div>
        </section>
      </HomeLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
}: any) => {
  const { tag } = await wpGetTagBySlug(params?.name)
  if (tag == null || tag?.error) {
    return {
      notFound: true,
    }
  }

  const { posts, pageInfo } = await wpGetPostsByTagId(tag.id)
  const seo = await getSeoDatas(`https://${env.DOMAIN}${tag.uri}`)

  return {
    props: {
      tag,
      posts,
      seo,
      pageInfo,
    },
  }
}

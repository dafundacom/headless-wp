import { wpGetTagBySlug } from "@/lib/wp-tags"
import { wpGetPostsByTagId } from "@/lib/wp-posts"
import { Header } from "@/components/Header"
import { PostCard } from "@/components/Card/PostCard"
import { PostCardSide } from "@/components/Card/PostCardSide"

interface TagProps {
  tag: {
    name: string
  }
  posts: any
}
export default function Tag(props: TagProps) {
  // eslint-disable-next-line no-unused-vars
  const { tag, posts } = props

  return (
    <>
      <Header>
        <section className="mx-8 flex flex-row">
          <div>
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
              }) => {
                return (
                  <PostCard
                    key={post.id}
                    src={post.featuredImage.sourceUrl}
                    alt={post.featuredImage.altText}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                  />
                )
              },
            )}
          </div>

          <aside className="w-4/12">
            <div className="rounded-xl border border-gray-100 p-4 sticky top-8">
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
                }) => {
                  return (
                    <PostCardSide
                      key={post.id}
                      src={post.featuredImage.sourceUrl}
                      alt={post.featuredImage.altText}
                      title={post.title}
                      slug={post.slug}
                    />
                  )
                },
              )}
            </div>
          </aside>
        </section>
      </Header>
    </>
  )
}
export const getServerSideProps = async ({ params }: any) => {
  const { tag } = await wpGetTagBySlug(params?.name)
  if (tag == null || tag?.error) {
    return {
      notFound: true,
    }
  }

  const { posts } = await wpGetPostsByTagId(tag.id)
  return {
    props: {
      tag,
      posts,
    },
  }
}

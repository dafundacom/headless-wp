import axios from "axios"
import { wpUpdateUserAvatar } from "./wp-users"

import env from "@/env"
import {
  QUERY_WP_ALL_POSTS,
  QUERY_WP_POSTS_BY_AUTHOR_SLUG,
  QUERY_WP_POSTS_BY_CATEGORY_SLUG,
  QUERY_WP_POST_PER_PAGE,
  QUERY_WP_POSTS_BY_TAG_ID,
  QUERY_WP_ALL_POSTS_LOAD_MORE,
  QUERY_WP_ALL_SLUG,
  QUERY_WP_POST_BY_SLUG,
} from "@/data/wp-posts"

export function wpPostPathBySlug(slug: string) {
  return `/${slug}`
}

export async function wpFetchAPI(query: string, variables?: any) {
  const headers = { "Content-Type": "application/json" }

  const res = await axios({
    url: env.WP_API_URL,
    headers: headers,
    params: { query: query, variables: variables },
  })

  return res.data
}
export async function wpGetAllPosts() {
  const data = await wpFetchAPI(QUERY_WP_ALL_POSTS)
  const posts = data?.data.posts.edges.map(({ node = {} }) => node)

  return {
    posts: Array.isArray(posts) && posts.map(wpMapPostData),
  }
}
export async function wpGetAllPostsLoadMore(after = "") {
  const data = await wpFetchAPI(QUERY_WP_ALL_POSTS_LOAD_MORE, {
    variables: { after },
  })
  const posts = data?.data.posts.edges.map(({ node = {} }) => node)
  return {
    posts: Array.isArray(posts) && posts.map(wpMapPostData),
    pageInfo: data?.data.posts.pageInfo,
  }
}
export function wpMapPostData(post = {}) {
  const data: any = { ...post }

  if (data.author) {
    data.author = {
      ...data.author.node,
    }
  }

  if (data.author?.avatar) {
    data.author.avatar = wpUpdateUserAvatar(data.author.avatar)
  }

  if (data.categories) {
    data.categories = data.categories.edges.map(({ node }: any) => {
      return {
        ...node,
      }
    })
  }

  if (data.tags) {
    data.tags = data.tags.edges.map(({ node }: any) => {
      return {
        ...node,
      }
    })
  }

  // if (data.content) {
  //   if (data.content.includes(`https://media.wowkia.com`)) {
  //     let content
  //     content = data.content
  //     content = content.replace(
  //       /href="https:\/\/media.wowkia/gm,
  //       'href="https://wowkia',
  //     )
  //     content = content.replace(
  //       /https:\/\/media.wowkia.com\/wp-content/gm,
  //       "https://cdn.wowkia.com/wp-content",
  //     )
  //     data.content = content
  //   }
  // }

  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node
    let imageUrl
    imageUrl = data.featuredImage.sourceUrl
    if (imageUrl.includes("media") === true) {
      imageUrl = imageUrl.replace("media", "cdn")
      data.featuredImage.sourceUrl = imageUrl
    }
  }

  return data
}

export async function wpGetAllSlug() {
  const after = ""
  const data = await wpFetchAPI(QUERY_WP_ALL_SLUG, {
    variables: { after },
  })
  const posts = data?.posts.edges.map(({ node = {} }) => node)
  return {
    posts: Array.isArray(posts) && posts.map(wpMapPostData),
  }
}
export async function wpGetPostBySlug(slug: string) {
  let postData
  try {
    postData = await wpFetchAPI(QUERY_WP_POST_BY_SLUG, { slug })
  } catch (e) {
    console.log(`[posts][wpGetPostBySlug] Failed to query post data: ${e}`)
    throw e
  }
  if (postData.post === null) {
    let post: { error: string } = {
      error: "",
    }
    post.error = "Something went wrong"
    return { post }
  }
  const post = [postData?.data.post].map(wpMapPostData)[0]

  return {
    post,
  }
}
export async function wpGetPostsByAuthorSlug(
  slug: string | string[],
  after = "",
) {
  let postData

  try {
    postData = await wpFetchAPI(QUERY_WP_POSTS_BY_AUTHOR_SLUG, {
      slug,
      after,
    })
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }
  if (postData.posts === null) {
    let post: { error: string } = {
      error: "",
    }
    post.error = "Something went wrong"
    return { post }
  }
  const posts = postData?.data.posts.edges.map(({ node = {} }) => node)
  const authorId = posts[0]?.author.node.id
  return {
    posts: Array.isArray(posts) && posts.map(wpMapPostData),
    pageInfo: postData?.data.posts.pageInfo,
    authorId: authorId,
  }
}

export async function wpGetPostsByCategoryId(categoryId: any, after = "") {
  let postData
  try {
    postData = await wpFetchAPI(QUERY_WP_POSTS_BY_CATEGORY_SLUG, {
      categoryId,
      after,
    })
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }
  if (postData.posts === null) {
    let posts: { error: string } = {
      error: "",
    }
    posts.error = "Something went wrong"
    return { posts }
  }

  const posts = postData?.data.posts.edges.map(({ node = {} }) => node)
  return {
    posts: Array.isArray(posts) && posts.map(wpMapPostData),
    pageInfo: postData?.data.posts.pageInfo,
  }
}

export async function wpGetPostsByTagId(id: any, after = "") {
  let postData
  try {
    postData = await wpFetchAPI(QUERY_WP_POSTS_BY_TAG_ID, { id, after })
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }
  if (postData.data.tag === null) {
    let posts: { error: string } = {
      error: "",
    }
    posts.error = "Something went wrong"
    return { posts }
  }
  const posts = postData?.data.tag.posts.edges.map(({ node = {} }) => node)

  return {
    posts: Array.isArray(posts) && posts.map(wpMapPostData),
    pageInfo: postData?.data.tag.posts.pageInfo,
  }
}

// export async function wpGetRecentPosts({ count }: { count: number }) {
//   const { posts } = await wpGetAllPosts()
//   const sorted = sortObjectsByDate(posts)
//   return {
//     posts: sorted.slice(0, count),
//   }
// }

export function wpSanitizeExcerpt(excerpt: string) {
  if (typeof excerpt !== "string") {
    throw new Error(
      `Failed to sanitize excerpt: invalid type ${typeof excerpt}`,
    )
  }

  let sanitized = excerpt

  sanitized = sanitized.replace(/\s?\[&hellip;\]/, "&hellip;")
  sanitized = sanitized.replace("....", ".")
  sanitized = sanitized.replace(".&hellip;", ".")
  sanitized = sanitized.replace(/<p>/gi, "")
  sanitized = sanitized.replace(/<\/p>/gi, "")
  sanitized = sanitized.replace(/\w*<a class="more-link".*<\/a>/, "")

  return sanitized
}

export function wpMapPostDataLM(post = {}) {
  const data: any = { ...post }
  if (data.node.author) {
    data.node.author = {
      ...data.node.author.node,
    }
  }

  if (data.author?.avatar) {
    data.author.avatar = wpUpdateUserAvatar(data.author.avatar)
  }

  if (data.node.categories) {
    data.node.categories = data.node.categories.edges.map(({ node }: any) => {
      return {
        ...node,
      }
    })
  }

  if (data.node.featuredImage) {
    data.node.featuredImage = data.node.featuredImage.node
  }
  return data
}

export async function wpGetRelatedPosts(
  category: { categoryId: any },
  postId: any,
  count = 6,
) {
  let relatedPosts: string | any[] = []

  if (category) {
    const { posts }: any = await wpGetPostsByCategoryId(category.categoryId)
    const filtered = posts.filter(({ postId: id }: any) => id !== postId)
    relatedPosts = filtered.map(
      (post: {
        title: string
        author: any
        date: Date
        categories: any
        slug: string
        featuredImage: string
      }) => ({
        title: post.title,
        author: post.author,
        date: post.date,
        categories: post.categories,
        slug: post.slug,
        featuredImage: post.featuredImage,
      }),
    )
  }

  if (relatedPosts.length > count) {
    return relatedPosts.slice(0, count)
  }
  return relatedPosts
}

export async function wpGetPostsPerPage() {
  if (process.env.WP_POSTS_PER_PAGE) {
    return Number(process.env.WP_POSTS_PER_PAGE)
  }

  try {
    const data = await wpFetchAPI(QUERY_WP_POST_PER_PAGE)
    return Number(data.allSettings.readingSettingsPostsPerPage)
  } catch (e) {
    console.log(`Failed to query post per page data: ${e}`)
    throw e
  }
}

export async function wpGetPagesCount(
  posts: string | any[],
  postsPerPage: number,
) {
  const _postsPerPage = postsPerPage ?? (await wpGetPostsPerPage())
  return Math.ceil(posts.length / _postsPerPage)
}

export async function wpGetPaginatedPosts(currentPage = 1) {
  const { posts, pageInfo } = await wpGetAllPostsLoadMore()

  const postsPerPage = await wpGetPostsPerPage()
  const pagesCount = await wpGetPagesCount(posts as any, postsPerPage)
  let page = Number(currentPage)
  if (typeof page === "undefined" || isNaN(page) || page > pagesCount) {
    page = 1
  }
  const offset = postsPerPage * (page - 1)
  return {
    //@ts-ignore FIX: later
    posts: posts.slice(offset, offset + postsPerPage),
    pagination: {
      currentPage: page,
      pagesCount,
    },
    pageInfo: pageInfo,
  }
}

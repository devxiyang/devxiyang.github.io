import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

// // Function to assign unique IDs to each tag
// function assignUniqueIds(tagCounts: Record<string, number>): Record<string, { count: number; id: number }> {
//   const tagsWithIds: Record<string, { count: number; id: number }> = {};
//   let uniqueId = 1;

//   for (const tag in tagCounts) {
//       tagsWithIds[tag] = { count: tagCounts[tag], id: uniqueId++ }
//   }

//   return tagsWithIds;
// }

// const tagsWithId = assignUniqueIds(tagData)

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const paths = tagKeys.map((tag) => ({
    tag: decodeURI(tag)
  }))

  return paths
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURI(params.tag) // 不知道为什么build的时候被encode了两次，所以只能decode两次了
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )

  // console.log('原始tag:', params.tag, '解码tag:', tag, '过滤的帖子:', filteredPosts.length)

  if (filteredPosts.length === 0) {
    // return notFound()
    return `${params.tag} == ${tag}`
  }
  return <ListLayout posts={filteredPosts} title={title} />
}

"use client"

import React, { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart, FaComment, FaRegComment } from 'react-icons/fa'

interface Like {
  userId: string
}

interface Comment {
  userId: string
  text: string
}

interface Post {
  id: string
  imagePath: string
  overlays?: string
  likes: Like[]
  comments: Comment[]
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/getPosts')
        const data: Post[] = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="bg-pink-50 w-screen h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-pink-50 w-screen h-screen flex flex-col">
        <div className="flex flex-col text-center justify-center mt-16">
          <h1 className="font-exo text-2xl font-semibold">It's quiet around here...</h1>
          <h2 className='font-exo text-xl font-medium'>there are no posts yet</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-pink-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="w-full overflow-hidden">
                <img 
                  src={post.imagePath} 
                  alt="Post" 
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '600px' }}
                />
              </div>
              
              {post.overlays && (
                <div className="p-2">
                  <p className="text-sm text-gray-600">{post.overlays}</p>
                </div>
              )}
              
              <div className="p-4 flex justify-between">
                <div className="flex items-center space-x-2">
                  {post.likes.length > 0 ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-500" />
                  )}
                  <span className="text-gray-700">{post.likes.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaRegComment className="text-gray-500" />
                  <span className="text-gray-700">{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
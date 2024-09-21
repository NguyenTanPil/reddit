import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Post } from '../entities/Post';
import { CreatePostInput } from '../types/CreatePostInput';
import { PostMutationResponse } from '../types/PostMutationResponse';
import { UpdatePostInput } from '../types/UpdatePostInput';
import { checkAuth } from '../middleware/checkAuth';

@Resolver()
export class PostResolver {
	@Mutation((_returns) => PostMutationResponse)
	@UseMiddleware(checkAuth)
	async createPost(@Arg('createPostInput') { title, text }: CreatePostInput): Promise<PostMutationResponse> {
		try {
			const newPost = Post.create({
				title,
				text,
			});

			await newPost.save();

			return {
				code: 200,
				success: true,
				message: 'Post created successfully',
				post: newPost,
			};
		} catch (error) {
			return {
				code: 500,
				success: false,
				message: `Internal error: ${error.message}`,
			};
		}
	}

	@Query((_returns) => [Post], { nullable: true })
	async getPosts(): Promise<Post[] | PostMutationResponse> {
		try {
			return Post.find();
		} catch (error) {
			return {
				code: 500,
				success: false,
				message: `Internal error: ${error.message}`,
			};
		}
	}

	@Query((_returns) => Post, { nullable: true })
	async getPost(@Arg('id', (_type) => ID) id: number): Promise<Post | PostMutationResponse | null> {
		try {
			const finedPost = await Post.findOne({
				where: [
					{
						id,
					},
				],
			});

			return finedPost;
		} catch (error) {
			return {
				code: 500,
				success: false,
				message: `Internal error: ${error.message}`,
			};
		}
	}

	@Mutation((_returns) => PostMutationResponse)
	@UseMiddleware(checkAuth)
	async updatePost(@Arg('updatePostInput') { id, title, text }: UpdatePostInput): Promise<PostMutationResponse> {
		try {
			const finedPost = await Post.findOne({
				where: [{ id }],
			});

			if (!finedPost) {
				return {
					code: 400,
					success: false,
					message: 'Post not found',
				};
			}

			finedPost.title = title;
			finedPost.text = text;
			await finedPost.save();

			return {
				code: 200,
				success: true,
				message: 'Post updated successfully',
				post: finedPost,
			};
		} catch (error) {
			return {
				code: 500,
				success: false,
				message: `Internal error: ${error.message}`,
			};
		}
	}

	@Mutation((_returns) => PostMutationResponse)
	@UseMiddleware(checkAuth)
	async deletePost(@Arg('id', (_type) => ID) id: number): Promise<PostMutationResponse> {
		try {
			const finedPost = await Post.findOne({
				where: [{ id }],
			});

			if (!finedPost) {
				return {
					code: 400,
					success: false,
					message: 'Post not found',
				};
			}

			await Post.delete({ id });
			return {
				code: 200,
				success: true,
				message: 'Post deleted successfully',
			};
		} catch (error) {
			return {
				code: 500,
				success: false,
				message: `Internal error: ${error.message}`,
			};
		}
	}
}

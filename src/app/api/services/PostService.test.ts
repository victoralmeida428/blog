import {PostService} from '@/app/api/services/PostService';
import {IPostRepository} from '@/app/api/repository/IPostRepository';
import {Post, PostCreateInput, PostDTO} from '@/app/api/dominio/Post';
import {NotFoundError} from '@/app/api/errors/NotFoundError';
import {NoContentError} from '@/app/api/errors/NoContentError';

// Mock da dependência IPostRepository
jest.mock('@/app/api/repository/IPostRepository');

describe('PostService', () => {
    let postService: PostService;
    let mockPostRepository: jest.Mocked<IPostRepository>;

    // Dados falsos para serem usados nos testes
    const fakePost = Post.reconstitute({
        id: 1,
        title: 'Post de Teste',
        content: 'Conteúdo do post de teste.',
        isPublished: false,
        createdAt: new Date(),
        authorId: 1,
    });

    beforeEach(() => {
        // Criamos um mock do repositório com todos os seus métodos
        mockPostRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        // Instanciamos o serviço com o repositório falso
        postService = new PostService(mockPostRepository);
    });

    afterEach(() => {
        // Limpa todos os mocks após cada teste
        jest.clearAllMocks();
    });

    // ===================================
    // Testes para createPost
    // ===================================
    describe('createPost', () => {
        it('should create and return a new post', async () => {
            const inputData: PostCreateInput = {
                title: 'Novo Post',
                content: 'Conteúdo',
                authorId: 1,
                isPublished: false
            };
            mockPostRepository.create.mockResolvedValue(fakePost);

            const result = await postService.createPost(inputData);

            expect(result).toBe(fakePost);
            expect(mockPostRepository.create).toHaveBeenCalled();
        });

        it('should throw an error if title is empty', async () => {
            const inputData: PostCreateInput = {title: '', content: 'Conteúdo', authorId: 1, isPublished: false};

            await expect(postService.createPost(inputData)).rejects.toThrow('title is required');
        });
    });

    // ===================================
    // Testes para searchPost
    // ===================================
    describe('searchPost', () => {
        it('should return a post when found', async () => {
            mockPostRepository.findById.mockResolvedValue(fakePost);

            const result = await postService.searchPost(1);

            expect(result).toBe(fakePost);
            expect(mockPostRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should return null if post is not found', async () => {
            mockPostRepository.findById.mockResolvedValue(null);

            const result = await postService.searchPost(999);

            expect(result).toBeNull();
        });

        it('should throw an error for invalid id', async () => {
            await expect(postService.searchPost(0)).rejects.toThrow('id is required');
        });
    });

    // ===================================
    // Testes para ListPost
    // ===================================
    describe('ListPost', () => {
        it('should return an array of posts', async () => {
            const postsArray = [fakePost, fakePost];
            mockPostRepository.findAll.mockResolvedValue(postsArray);

            const result = await postService.ListPost();

            expect(result).toEqual(postsArray);
            expect(result.length).toBe(2);
        });

        it('should throw NoContentError if no posts are found', async () => {
            mockPostRepository.findAll.mockResolvedValue([]);

            await expect(postService.ListPost()).rejects.toThrow(NoContentError);
        });
    });

    // ===================================
    // Testes para updatePost
    // ===================================
    describe('updatePost', () => {
        it('should update a post successfully', async () => {
            const updateData: Partial<PostDTO> = {title: 'Título Atualizado'};
            mockPostRepository.findById.mockResolvedValue(fakePost);

            await postService.updatePost(1, updateData);

            expect(mockPostRepository.findById).toHaveBeenCalledWith(1);
            expect(fakePost.title).toBe('Título Atualizado');
            expect(mockPostRepository.update).toHaveBeenCalledWith(fakePost);
        });

        it('should throw NotFoundError if post to update is not found', async () => {
            mockPostRepository.findById.mockResolvedValue(null);
            const updateData: Partial<PostDTO> = {title: 'Título'};

            await expect(postService.updatePost(999, updateData)).rejects.toThrow(NotFoundError);
        });
    });

    // ===================================
    // Testes para deletePost
    // ===================================
    describe('deletePost', () => {
        it('should delete a post successfully', async () => {
            mockPostRepository.findById.mockResolvedValue(fakePost);

            await postService.deletePost(1);

            expect(mockPostRepository.findById).toHaveBeenCalledWith(1);
            expect(mockPostRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundError if post to delete is not found', async () => {
            mockPostRepository.findById.mockResolvedValue(null);

            await expect(postService.deletePost(999)).rejects.toThrow(NotFoundError);
        });
    });
});

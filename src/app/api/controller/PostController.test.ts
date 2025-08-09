import {PostController} from './PostController'; // Ajuste o caminho
import {PostService} from '@/app/api/services/PostService';
import {Post, PostCreateInput} from '@/app/api/dominio/Post';
import {NextRequest} from 'next/server';
import {RouteContext} from "@/app/api/controller/AbsctractController";
import {PrismaPostRepository} from "@/app/api/repository/PrismaPostRepository";

// Mock do PostService: Dizemos ao Jest para criar uma versão falsa da classe
jest.mock('@/app/api/services/PostService');

describe('PostController', () => {
    let postController: PostController;
    let mockPostService: jest.Mocked<PostService>;

    // Bloco que roda antes de cada teste ('it')
    beforeEach(() => {
        // Cria uma nova instância mockada do serviço para cada teste
        // O jest.mock garante que o construtor não precisa de argumentos reais.
        mockPostService = new PostService(null as unknown as PrismaPostRepository) as jest.Mocked<PostService>;

        // Instancia o nosso controller, injetando o serviço FALSO
        postController = new PostController(mockPostService);

        // Mock para o método getID do AbstractController para simplificar
        // Aqui estamos "espionando" e substituindo a implementação
        jest.spyOn(postController, 'getID').mockResolvedValue(1);
    });

    // Bloco que roda depois de cada teste para limpar os mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ======================================================
    // Testes para o método getById
    // ======================================================
    describe('getById', () => {
        it('should return a post with status 200 when found', async () => {
            // ARRANGE (Organizar)
            // 1. Criamos um objeto de domínio falso que esperamos que o serviço retorne
            const fakePost = Post.reconstitute({
                id: 1,
                title: 'Test Post',
                content: 'Test Content',
                isPublished: true,
                createdAt: new Date(),
                authorId: 1,
            });

            // 2. Damos o "roteiro" para o nosso ator (o mock):
            // "Quando o método searchPost for chamado, retorne a Promise com o fakePost"
            mockPostService.searchPost.mockResolvedValue(fakePost);

            // 3. Criamos os objetos falsos para a requisição
            const mockRequest = {} as NextRequest;
            const mockContext: RouteContext = {params: {id: '1'}};

            // ACT (Agir)
            // 4. Executamos o método que queremos testar
            const response = await postController.getById(mockRequest, mockContext);
            const body = await response.json();

            // ASSERT (Verificar)
            // 5. Verificamos se o resultado foi o esperado
            expect(response.status).toBe(200);
            expect(body.id).toBe(1);
            expect(body.title).toBe('Test Post');
            expect(mockPostService.searchPost).toHaveBeenCalledWith(1); // Verifica se o serviço foi chamado com o ID correto
            expect(mockPostService.searchPost).toHaveBeenCalledTimes(1); // Verifica se foi chamado apenas uma vez
        });

        it('should return a 404 error when post is not found', async () => {
            // ARRANGE
            // Desta vez, o serviço retorna null
            mockPostService.searchPost.mockResolvedValue(null);

            const mockRequest = {} as NextRequest;
            const mockContext: RouteContext = {params: {id: '999'}};

            // ACT
            const response = await postController.getById(mockRequest, mockContext);

            // ASSERT
            expect(response.status).toBe(404);
            expect(await response.text()).toBe('Post not found');
        });
    });

    // ======================================================
    // Testes para o método createPost
    // ======================================================
    describe('createPost', () => {
        it('should create a new post and return it with status 201', async () => {
            // ARRANGE
            const inputData: PostCreateInput = {
                title: 'New Post',
                content: 'Content of the new post',
                authorId: 1,
                isPublished: false,
            };
            const createdPost = Post.reconstitute({id: 2, createdAt: new Date(), ...inputData});

            mockPostService.createPost.mockResolvedValue(createdPost);

            // Criamos um mock da requisição com um corpo (body)
            const mockRequest = new NextRequest('http://localhost/api/posts', {
                method: 'POST',
                body: JSON.stringify(inputData),
            });

            // ACT
            const response = await postController.createPost(mockRequest);
            const body = await response!.json();

            // ASSERT
            expect(response!.status).toBe(201); // Created
            expect(body.id).toBe(2);

            // Verificamos se o serviço foi chamado com os dados corretos do body
            expect(mockPostService.createPost).toHaveBeenCalledWith(inputData);
        });
    });

    // ======================================================
    // Testes para o método deletePost
    // ======================================================
    describe('deletePost', () => {
        it('should return status 204 on successful deletion', async () => {
            // ARRANGE
            // O serviço retorna true para indicar que a deleção foi bem sucedida
            mockPostService.deletePost.mockResolvedValue();
            const mockRequest = {} as NextRequest;
            const mockContext: RouteContext = {params: {id: '1'}};

            // ACT
            const response = await postController.deletePost(mockRequest, mockContext);

            // ASSERT
            expect(response.status).toBe(200);
            expect(mockPostService.deletePost).toHaveBeenCalledWith(1);
        });
    });

});
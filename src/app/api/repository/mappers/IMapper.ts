/**
 * Interface genérica para um Mapper.
 * @template DomainEntity A classe/entidade da camada de Domínio.
 * @template PrismaRaw O tipo de dados bruto da camada de persistência (ex: Prisma).
 * @template PrismaUpdate O tipo de dados esperado para operações de escrita na persistência.
 * @template PrismaCreate O tipo de dados esperado para operações de escrita na persistência.
 */
export interface IMapper<DomainEntity, PrismaRaw, PrismaUpdate, PrismaCreate> {
    /**
     * Mapeia do formato da persistência para a entidade de Domínio.
     * @param raw O objeto de dados brutos da persistência.
     * @returns Uma instância da entidade de Domínio.
     */
    toDomain(raw: PrismaRaw): DomainEntity;

    /**
     * Mapeia da entidade de Domínio para o formato da persistência (para escrita).
     * @param domain A instância da entidade de Domínio.
     * @returns Um objeto no formato esperado pela camada de persistência para escrita.
     */
    toUpdatePrisma(domain: DomainEntity): PrismaUpdate;

    toCreatePrisma(domain: DomainEntity): PrismaCreate;
}
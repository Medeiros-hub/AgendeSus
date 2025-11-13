export abstract class BaseEntity {
  protected constructor(
    public readonly id: string,
    public readonly createdAt: Date = new Date(),
  ) {}

  /**
   * Compara duas entidades pela identidade (ID)
   */
  public equals(entity: BaseEntity): boolean {
    if (!entity || !(entity instanceof BaseEntity)) {
      return false;
    }
    return this.id === entity.id;
  }

  /**
   * Retorna uma representação do objeto para persistência
   */
  abstract toPersistence(): Record<string, any>;
}

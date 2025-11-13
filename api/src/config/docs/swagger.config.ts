import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (app: NestExpressApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Agende SUS API')
    .setDescription(
      'API do sistema Agende SUS - Sistema de agendamento para unidades de saúde',
    )
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticação e registro')
    .addTag('users', 'Gerenciamento de usuários')
    .addCookieAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  return SwaggerModule.setup('api/docs', app, documentFactory);
};

import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { List } from './entities/list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ListController],
  providers: [ListService],
  imports: [
    TypeOrmModule.forFeature([ List ]),
    AuthModule,
  ],
  exports:[
    ListService,
    TypeOrmModule,
  ]
})
export class ListModule {}

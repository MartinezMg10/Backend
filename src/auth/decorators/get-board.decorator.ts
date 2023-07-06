import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export  const GetBoard = createParamDecorator(
    (data:string, ctx: ExecutionContext )=>{
        const req = ctx.switchToHttp().getRequest();
        const board = req.board;

        if (!board)
        throw new InternalServerErrorException('User not found (request')

        return (!data) ? board : board[data];

    }
)
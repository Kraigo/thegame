import { Basis, BasisParams } from "./Basis";
import { Game } from "./Game";

export interface BlockParams extends BasisParams {
    
}

export class Block extends Basis {
    constructor(game: Game, params: BlockParams) {
        super(game, params);
    }
}
/*
 *  Copyright (c) 2017.
 *
 *  @author Alexander Zagovorichev <zagovorichev@gmail.com>
 */

export class Company {
    constructor (
        public id: number = 0,
        public title: string = '',
        public logo: string = '',
        public signature: string = '',
        public logo250: string = '',
        public sign: string = '', // b64 of the signature
    ) {}
}

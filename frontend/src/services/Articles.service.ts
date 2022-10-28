export class ArticlesService {

    readonly hostname = 'http://localhost:3000/articles?';

    async list(page=1, size=10){
        const response = await fetch(this.hostname+ new URLSearchParams({
            "size":size.toString(),
            "page":page.toString()
        }))

        if(response.status==202){
            throw new CachingException('caching');
        }
        return response.json();
    }
}

export class CachingException extends Error {

}
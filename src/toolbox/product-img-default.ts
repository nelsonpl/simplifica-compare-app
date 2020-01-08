import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Product } from "../models/product";

@Injectable()
export class ProductImgDefault {

	public apiUrl = environment.server_url;

    productImg(product: Product): string {
        if (product.image)
            return `${this.apiUrl}storage/product/${product.image}`;

        return this.getDefaultImg(product);
    }

    defaultImg(event, product: Product): void {
        const target = event.target;
        target.src = this.getDefaultImg(product);
    }

    private getDefaultImg(product: Product): string {
        if (product.store)
            switch (product.store.category) {
                case 'Posto de Combustível':
                    return './assets/img/no-image/fuel.png';
            }
        return './assets/img/no-image/default.png';
    }
}
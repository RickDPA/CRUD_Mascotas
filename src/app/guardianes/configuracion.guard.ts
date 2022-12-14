import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ConfiguracionServicio } from "../servicios/configuracion.service";


@Injectable()
export class ConfiguraiconGuard implements CanActivate{
    constructor(private router: Router,
                private configuracionServicio: ConfiguracionServicio){}


    canActivate(): Observable<boolean>{
        return this.configuracionServicio.getConfiguracion().pipe(
            map( configuracion => {
                if(configuracion.permitirRegistro){
                    return true;
                }else{
                    this.router.navigate(['/login']);
                    return false;
                }
            })
        );
    }



}
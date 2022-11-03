import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'flash-messages-angular';
import { timeout } from 'rxjs';
import { Cliente } from 'src/app/modelo/cliente.model';
import { ClienteServicio } from 'src/app/servicios/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente [];
  cliente: Cliente = {
    nombre: "",
    tipo: "",
    edad: 0,
    enfermedades: "",
    created_at: new Date(),
    updated_at: new Date()
  };


  @ViewChild("clienteForm") clienteForm:NgForm; 
  @ViewChild("botonCerrar") botonCerrar:ElementRef;
  

  constructor(private clientesServicio: ClienteServicio,
              private flashMessages:FlashMessagesService,
              private router:Router) { }

            
  ngOnInit(): void {
    this.clientesServicio.getClientes().subscribe(
      clientes => {
        this.clientes = clientes;
        
        timeout(1500);

        for(let i = 0; i<clientes.length; i++ ){
            
          let fechaStringCreated:any = (this.clientes[i].created_at?.toString());
          let fechaStringUpdated:any = (this.clientes[i].updated_at?.toString());

          let fechaAuxiliarCreated:any = fechaStringCreated[18];
          let fechaAuxiliarUpdated:any = fechaStringUpdated[18];

          for(let j = 19; j<28; j++ ){
            
            fechaAuxiliarCreated += fechaStringCreated[j];
            fechaAuxiliarUpdated += fechaStringUpdated[j];
          }

          let dateCreated = new Date(+fechaAuxiliarCreated*1000);
          let dateUpdated = new Date(+fechaAuxiliarUpdated*1000);
          
          this.clientes[i].created_at = dateCreated.toLocaleDateString() + " " + dateCreated.toLocaleTimeString();
          this.clientes[i].updated_at = dateUpdated.toLocaleDateString() + " " + dateUpdated.toLocaleTimeString();
          
        }

      }
    )
  }



  agregar({value, valid}: {value:Cliente, valid:boolean}){
    if(!valid){
      this.flashMessages.show('Por favor llena el formulario correctamente', {
        cssClass: 'alert-danger', timeout: 4000
      });
    }else{

      value.created_at = new Date();
      value.updated_at = new Date();
      this.clientesServicio.agregarCliente(value);
      this.clienteForm.resetForm();
      this.cerrarModal();
    }
  }

  private cerrarModal(){
    this.botonCerrar.nativeElement.click();
  }

  eliminarA(cliente:Cliente){
    if(confirm('¿Seguro que desea eliminar la mascota?')){
      this.clientesServicio.eliminarCliente(cliente);
      this.router.navigate(['/']);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';
import { Commons } from '../../utils/commons.util';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  filters: FormGroup;
  loading = false;
  paginationMaxSize: number;
  itemsPerPage: number;

  constructor(public usersService: UsersService, private fb: FormBuilder, private commons: Commons) {
  }

  ngOnInit(): void {
    this.paginationMaxSize = 4;
    this.itemsPerPage = 5;
    this.loading = true;

    this.usersService.getUsers()
      .catch(() => {
        this.loading = false;
        Swal.fire({
          title: 'Se ha producido un error',
          text: 'No se ha podido descargar el listado de usuarios',
          icon: 'error',
          allowOutsideClick: false
        });
      })
      .finally(() => this.loading = false);

    this.createFiltersForm();
  }

  createFiltersForm(): void {
    this.filters = this.fb.group({
      dni: [],
      name: [],
      surname: [],
      phone: [],
      mail: [],
    });
  }

  filter(): void {
    const filters = this.filters.value;

    if (Object.values(filters).every(value => !value)) {
      Swal.fire({
        title: 'No se puede filtrar',
        text: 'Debe introducir al menos un filtro',
        icon: 'warning',
        allowOutsideClick: false
      });
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Aplicando filtros',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.commons.forceLast(this.usersService.filter.bind(this.usersService, filters))
      .then(() => {
        Swal.fire({
          title: 'Filtros aplicados',
          text: `Elementos encontrados: (${this.usersService.users.length})`,
          icon: 'success',
          allowOutsideClick: false
        });
      });
  }

  removeFilters(): void {
    Swal.fire({
      title: 'Espere',
      text: 'Eliminando filtros',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.commons.forceLast(this.usersService.filter.bind(this.usersService))
      .then(() => {
        this.filters.reset();
        Swal.fire({
          title: 'Filtros eliminados',
          text: 'Se han eliminado los filtros correctamente',
          icon: 'success',
          allowOutsideClick: false
        });
      });
  }

  async deleteUser(id: string): Promise<void> {
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'El usuario se eliminará de la base de datos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });

    if (result.isDismissed) {
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Eliminando usuario',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.commons.forceLast(this.usersService.deleteUser(id))
      .then(() => {
        Swal.fire({
          title: 'Usuario eliminado',
          text: 'El usuario se eliminó correctamente',
          icon: 'success',
          allowOutsideClick: false
        });
      }).catch(() => {
        Swal.fire({
          title: 'Se ha producido un error',
          text: 'No se ha podido eliminar el usuario',
          icon: 'error',
          allowOutsideClick: false
        });
      });
  }

}

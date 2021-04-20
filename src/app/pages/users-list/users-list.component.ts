import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  filters: FormGroup;
  loading = false;

  constructor(public usersService: UsersService, private fb: FormBuilder) {
    this.createFiltersForm();
  }

  ngOnInit(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe(() => {
      this.loading = false;
    });
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
    console.log(Object.values(filters).every(value => !value));

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

    this.usersService.filter(filters);

    Swal.fire({
      title: 'Filtros aplicados',
      text: `Elementos encontrados: (${this.usersService.users.length})`,
      icon: 'success',
      allowOutsideClick: false
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

    this.filters.reset();
    this.usersService.filter();

    Swal.fire({
      title: 'Filtros eliminados',
      text: 'Se han eliminado los filtros correctamente',
      icon: 'success',
      allowOutsideClick: false
    });
  }

}

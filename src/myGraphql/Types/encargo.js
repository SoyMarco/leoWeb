const typeEncargo = `{
			id
			vendedor
			cliente
			folio
			total
			referencia
			createAt
			tipo
			guardado {
				status
				fecha
				vendedor
			}
			entregado {
				status
				fecha
				vendedor
			}
			cancelado {
				status
				fecha
				vendedor
			}
			notas{
				nota
				fecha
				vendedor
				idUnico
			}
			productos {
				vendedor
				nombre
				precio
				cantidad
				totalArticulo
				talla
				color
				genero
				modelo
				key
				idUnico
				_id
				createAt
				tipo
				entregado {
					status
					fecha
					vendedor
				}
				cancelado {
					status
					fecha
					vendedor
				}
			}
			abonos {
				_id
				idVenta
				folioVenta
				abono
				vendedor
				createAt
				cancel
				tipo
				cancelado {
					status
					fecha
					vendedor
				}
			}
		}`;

export { typeEncargo };

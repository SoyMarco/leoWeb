const getCorteType = `ventas {
				key
				id
				createAt
				folio
				cancelado
				total
				efectivo
				tarjeta
				aCuenta
				pagoCon
				referencia
				notas
                tipo
				productos {
					_id
					idArray
					key
					nombre
					precio
					cantidad
					cancelado
					totalArticulo
					apartado
					refApartado
                    tipo
				}
			}
			totales {
				key
				inicioCaja
				ventasEfectivo
				totalEfectivo
				efectivoFinalCaja
				entSal
				entradas
				salidas
				efectivo
				tarjeta
				aCuenta
				total
				finCaja
				recargas
			}`;
export { getCorteType };

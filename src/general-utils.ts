import { SnackBarParams } from "./store/models"

export function getSnackBarErrorParams(error: any): SnackBarParams {
  if( error.response?.status ){
    switch ( error.response.status ){
      case 400: return { snackbar: true, color: 'warning', text: error.response.data?.message || 'Solicitud erronea' }
      case 401: return { snackbar: true, color: 'warning', text: error.response.data?.message || 'Usted no esta autorizado para ejecutar esta acción' }
      case 404: return { snackbar: true, color: 'error', text: error.response.data?.message || 'El recurso solicitado no existe' }      
      case 500: return { snackbar: true, color: 'error', text: 'Error interno, por favor intentelo en otro momento' }
      default: return { snackbar: true, color: 'error', text: 'Error desconocido, por favor intentelo en otro momento' }
    }      
  }else{
    return { snackbar: true, color: 'error', text: 'Error interno, por favor intentelo en otro momento' }
  }
}
import {DetailPlaceResponse} from "../detail-place/detail-place-response";

export class HomeStayResponse {
  id: number;
  homeStayName: string;
  description: string;
  phone: string;
  image: string;
  villageName: string;
  cityName: string;
  districtName: string;
  status: boolean;
  detailPlace: DetailPlaceResponse[];
}

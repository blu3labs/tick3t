export interface UserBodyRequestData {
  addresses: userTickets[];
}

interface userTickets {
  address: string;
  ticket: string;
}

export interface EventBodyRequestData {
  address: string;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
  type: string;
}

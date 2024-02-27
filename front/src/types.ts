export type Room = {
    id: string;
    date_start: string,
    date_end: string,
    card_name: string,
    card_condition: string,
    min_bid_price: string,
    min_bid_increment: string,
    is_active: boolean
}
export type Bid = {
    id: string,
    auction_id: string,
    price: number
}
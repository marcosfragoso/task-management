/* eslint-disable prettier/prettier */
import { randomUUID } from "node:crypto"


export class Task {
    public id: string
    public title: string
    public description: string
    public status: string
    public expirationDate: Date

    constructor(title: string, description: string, status: string, expirationDate: Date, id?: string) {
        this.title = title
        this.description = description
        this.status = status
        this.expirationDate = expirationDate
        this.id =  id || randomUUID()
    }
}

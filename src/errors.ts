export class InvalidVenueName extends Error {
  constructor() {
    super("The venue name entered is already taken");
  }
}

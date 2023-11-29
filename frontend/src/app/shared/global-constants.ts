// Define a utility class with static properties and constants.
export class GlobalConstants {
  // static contactNumberRegex(contactNumberRegex: any): any {
  //   throw new Error('Method not implemented.');
  // }
  // static emailRegex(emailRegex: any): any {
  //   throw new Error('Method not implemented.');
  // }
  // Static error message for generic errors.
  public static genericError: string =
    'Something went wrong. Please try again later';

  // Static error message for unauthorized access.
  public static unauthorized: string =
    'You are not authorized to access this page';

  // Define a static error message for when a product already exists.
  public static productExistError: string = 'Product already exist';

  // Define a static success message for when a product is added successfully.
  public static productAdded: string = 'Product Added Successfully';

  // Regular expression for matching names (letters, numbers, and spaces).
  public static nameRegex: string = '[a-zA-Z0-9 ]*';

  // Regular expression for matching email addresses.
  public static emailRegex: string =
    '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';

  // Regular expression for matching contact numbers (assumed to be 10 digits long).
  public static contactNumberRegex: string = '^[0-9]{10,10}$';

  // Static constant for representing the "error" string.
  public static error: string = 'error';
}

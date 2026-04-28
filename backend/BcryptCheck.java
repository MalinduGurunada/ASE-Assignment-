public class BcryptCheck {
    public static void main(String[] args) {
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        System.out.println("Match password123? " + encoder.matches("password123", "$2a$10$x.U/eY89zYl8Qvj3DkXvVOTjX9.6jZ0/T6g8zE8lQ9Q4q2/7Z8Q7S"));
        System.out.println("Match password? " + encoder.matches("password", "$2a$10$7EqJtq98hPqEX7fNZaFWoO5Gk5hgbf28pQ5e0MyoVo9zc3rroWAtG"));
        System.out.println("New hash for password123: " + encoder.encode("password123"));
    }
}

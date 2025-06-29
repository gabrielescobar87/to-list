package ItemsFromChallenge;

public class Third {
	public static void main(String[] args) {
		int n1 = 1, n2 = 2;

		n1 += n2;
		n2 = n1 - n2;
		n1 -= n2;

		System.out.println("n1: " + n1 +"\nn2: " + n2);
	}
}

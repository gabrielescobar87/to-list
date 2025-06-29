package ItemsFromChallenge;

public class Second {
	public static void main(String[] args) {

		String test  = " Test test  test test  test    ";

		StringBuilder stringBuilder = new StringBuilder();

		for(char character : test.toCharArray()) {
			if(!Character.isWhitespace(character)){
				stringBuilder.append(character);
			}
		}

		System.out.println(stringBuilder);
	}
}

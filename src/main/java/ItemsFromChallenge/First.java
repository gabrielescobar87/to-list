package ItemsFromChallenge;
import java.util.List;

public class First {
	public static void main(String[] args) {
		List<String> list = List.of("And","Add","and","add","About","Aurora","Test","123");


		list.stream().filter(s -> s.length() == 3 && s.toLowerCase().startsWith("a")).forEach(System.out::println);
	}
}
